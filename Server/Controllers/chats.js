import Chat from "../models/Chat.js";

const getChats =  async (req, res) => {
    const { from, to } = req.params;
    
    try {
        const chats = await Chat.find({
            $or: [
                { from, to },
                { from: to, to: from }
            ]
        })

        res.status(200).json(chats);
    } catch (error) {
        console.error('Error fetching chat history:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}
export default getChats;