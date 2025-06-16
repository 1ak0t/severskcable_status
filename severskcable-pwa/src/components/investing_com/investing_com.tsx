import dayjs from "dayjs";

function Investing_com() {
    return (
        <>
            <iframe id="usd-curr"
                    src="https://www.widgets.investing.com/live-currency-cross-rates?theme=lightTheme&hideTitle=true&pairs=2186"
                    width="1024" height="130"></iframe>
            <iframe height="480" width="1024" src="https://ssltvc.investing.com/?pair_ID=959211&height=480&width=1024&interval=86400&plotStyle=area&domain_ID=1&lang_ID=1&timezone_ID=21"></iframe></>
    );
}

export default Investing_com;