import { Button } from 'antd';
import { useNavigate } from 'react-router-dom';

const KindOfRoomManage = () => {

    const navigate = new useNavigate();
    
    return (
        <>
            <Button
                onClick={
                    () => navigate('/admin/kind-of-room/CREATE')
                }
            >Thêm mới</Button>
        </>
    )
}

export default KindOfRoomManage;