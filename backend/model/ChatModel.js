import Chat from "../schema/chatSchema.js";

class ChatModel {
  async findExistingSession(id, queryString) {
    this.id = id;
    const session = await Chat.findOne({
      sessionId: id,
    });

    this.history = session?.messages || [];
    this.history.push({
      role: "user",
      content: queryString,
    });
    return this.history;
  }

  async saveHistoryInDb(answer) {
    this.history.push({
      role: "assistant",
      content: answer,
    });
    //store in mongodb
    const sessionId = this.id;
    console.log("history is", this.history);
    await Chat.findOneAndUpdate(
      { sessionId },

      {
        sessionId,
        messages: this.history,
      },

      { upsert: true },
    );
  }
}

export default new ChatModel();
