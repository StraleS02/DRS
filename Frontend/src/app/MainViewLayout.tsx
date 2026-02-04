import AuthWidget from "../features/auth/components/auth_widget/AuthWidget";
import { useAuth } from "../features/auth/useAuth";
import Navbar from "../layouts/navbar/Navbar";
import Sidebar from "../layouts/sidebar/Sidebar";
import ViewLayout from "../layouts/view/ViewLayout";
import { getNavbarItemsByRole, type NavbarItem } from "../lib/constants/navbar_items";

const MainViewLayout = () => {
    const {user} = useAuth();

    const navbarItems:NavbarItem[] = user ? getNavbarItemsByRole(user.role) : [];
    
    return (
        <ViewLayout navbar={<Navbar items={navbarItems} />} rightWidget={<AuthWidget />} sidebar={<Sidebar navbarItems={navbarItems}/>}></ViewLayout>
    );
}
export default MainViewLayout;