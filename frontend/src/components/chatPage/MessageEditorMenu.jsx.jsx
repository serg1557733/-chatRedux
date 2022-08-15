import { useDispatch } from 'react-redux';
import { editMessage } from '../../reducers/messageReducer';

//test
export const MessageEditorMenu = () => {

    const dispatch = useDispatch();


    return (
        <div>
            <button> Edit</button>
            <button> Delete </button>
            <button
                onClick={() => {
                    dispatch(editMessage({editMessage: '', showButtons: false, messageId: '' }))  
                }}
            > cancel</button>
        </div>
    )
}





