import { Spin } from "antd";

const Loading = ({ content }) => {

    return (
        <div className="fixed inset-0 flex justify-center items-center bg-design-charcoalblack opacity-70 backdrop-blur-sm z-" style={{zIndex: 10000}}>
            <Spin tip={content ? content : "Vui lòng chờ trong giây lát!"} size="large"></Spin>
        </div>
    )
}

export default Loading;