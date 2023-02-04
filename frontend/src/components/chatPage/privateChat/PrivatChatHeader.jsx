import { useSelector } from "react-redux"
import './userInfo.scss';
export const PrivatChatHeader = ({userName}) => {

//add dispatch and saving name for user to store
const selectedUser = useSelector(state => state.dataReducer.selectedUser)

    return (
        <div className="active" >
            <div > Private Chat with {selectedUser.toUpperCase()} </div>
        </div>
    )
}
