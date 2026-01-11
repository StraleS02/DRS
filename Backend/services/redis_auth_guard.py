"""
redis_auth_guard.py
Logika za rate-limit login-a preko Redis-a.

Specifikacija:
- brojimo neuspešne login pokušaje
- nakon 3 pogrešna pokušaja: blokiramo korisnika na određeno vrijeme (TTL)

Za testiranje NE stavljamo 15 min, nego 2 min (120 sekundi).
Kasnije je samo promjena konstante (ili env var).
"""

import os


# -----------------------------
# KONFIGURACIJA
# -----------------------------
# Koliko fail pokušaja je dozvoljeno prije blokade
FAIL_LIMIT = int(os.getenv("AUTH_FAIL_LIMIT", "3"))

# Koliko dugo traje blokada (2 minuta = 120s za test)
BLOCK_TTL_SECONDS = int(os.getenv("AUTH_BLOCK_TTL_SECONDS", str(2 * 60)))

# Koliko dugo čuvamo fail counter (da se resetuje ako neko prestane pokušavati)
# Može biti isto kao block TTL (2 min) za jednostavnost
FAIL_TTL_SECONDS = int(os.getenv("AUTH_FAIL_TTL_SECONDS", str(2 * 60)))


# -----------------------------
# REDIS KEY HELPERS
# -----------------------------
def _norm_email(email: str) -> str:
    return (email or "").strip().lower()


def fail_key(email: str) -> str:
    # Brojač neuspešnih pokušaja
    return f"login:fail:{_norm_email(email)}"


def block_key(email: str) -> str:
    # Indikator blokade
    return f"login:block:{_norm_email(email)}"


# -----------------------------
# GLAVNE FUNKCIJE
# -----------------------------
def is_blocked(r, email: str) -> tuple[bool, int]:
    """
    Provjerava da li je korisnik blokiran.
    Vraća:
      (True, seconds_left) ako je blokiran
      (False, 0) ako nije
    """
    bkey = block_key(email)

    if r.exists(bkey):
        ttl = r.ttl(bkey)  # koliko sekundi je ostalo
        return True, max(int(ttl), 0)

    return False, 0


def register_failed_attempt(r, email: str) -> tuple[bool, int, int]:
    """
    Zove se kada login nije uspešan.
    - INCR brojač fail-a
    - postavi TTL na brojač (ako je prvi put)
    - ako fail >= FAIL_LIMIT:
        postavi block key sa TTL i obriši fail counter

    Vraća:
      (blocked_now, block_ttl_seconds, fails_now)
    """
    fkey = fail_key(email)
    fails_now = int(r.incr(fkey))

    # Ako je prvi fail, postavi TTL da se counter automatski obriše
    if fails_now == 1:
        r.expire(fkey, FAIL_TTL_SECONDS)

    # Ako smo prešli limit -> blokiraj
    if fails_now >= FAIL_LIMIT:
        r.setex(block_key(email), BLOCK_TTL_SECONDS, "1")
        r.delete(fkey)
        return True, BLOCK_TTL_SECONDS, fails_now

    return False, 0, fails_now


def reset_failures(r, email: str) -> None:
    """
    Zove se na uspešan login.
    Briše fail counter.
    (Ne briše block key — block mora isteći sam ako postoji)
    """
    r.delete(fail_key(email))
