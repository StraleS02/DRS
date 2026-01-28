import styles from "./Loading.module.css";

type LoadingProps = {
    theme: "light" | "dark";
    size: "small" | "medium" | "large";
};

const Loading = ({theme, size}:LoadingProps) => {

    function getSize() {
        switch(size){
            case "small":
                return 10;
            case "medium":
                return 15;
            default:
                return 25;
        }
    }
    
    return (
        <div className={styles.loading} style={{gap: (getSize()/2).toString() + "px"}}>
            {Array.from({length: 5}).map((_, index) => (
                <div key={`loading-item-${index}`} className={styles[`item${index+1}`]} style={{backgroundColor: theme === "light" ? "white" : "red", width: (getSize()+2).toString() + "px", height: getSize().toString() + "px"}}></div>
            ))}
        </div>
    );
}
export default Loading;