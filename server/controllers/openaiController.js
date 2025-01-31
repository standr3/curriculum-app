const asyncHandler = require("express-async-handler");
require("dotenv").config();

const { OpenAI } = require("openai");
const openai = new OpenAI(process.env.OPENAI_API_KEY);

const postOpenAI = asyncHandler(async (req, res) => {
  console.log("req.body", req.body);
  const { name, lang} = req.body;

  if (!name || !lang) {
    return res.status(400).json({ message: "Name is required" });
  }

  try {
    let completeResponse = "";
    let continueToken = null;

    do {
      const requestPayload = {
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "user",
            content: `
            You are a teacher and need to capture the important topics one needs to know about when learning  about "${name}". Generate a very detailed, realistic, maximally expanded, and indent to go a level deeper mind map in the json format about the following topic "${name}".
            IMPORTANT: Rules for a mind map to follow: 
            - The mind map must be organized hierarchically.
            - Must not be in long sentences
            - Each node can have the following attributes: node, parent, children, relationship, rel_desc
            - The parent attribute must be present in all nodes except the root node. It must be the name of the parent node.
            - The children attribute is an array but must only be present if the node has children. Leaf nodes must not have children.
            - The relationship attribute must describe the relationship between the current node and its parent and must not be present if the node is the root node. The relationship must be one of the following: Symmetric, Inclusion, Characteristic, Action, Process, Temporal
            - The rel_desc must be a verb or phrase that could make sense placed in the sentence "Parent node <rel_desc> child node" and must not be present if the node is the root node.
            - Make sure the json syntax is correct and no "," are missing
            - Keep the starting name "${name}" of the root node; do not change it.
            - complete the mind map using "${lang}" language .
            Respond in json format and put the response inside a code block.
            `,
          },
        ],
        max_tokens: 1000,
        temperature: 0.7,
        ...(continueToken && { continuation_token: continueToken }),
      };

      const data = await openai.chat.completions.create(requestPayload);
      console.log("data", data);

      if (data && data.choices && data.choices[0].message.content) {
        completeResponse += data.choices[0].message.content;

        if (data.choices[0].finish_reason === "length") {
          continueToken = data.choices[0].continuation_token;
        } else {
          continueToken = null;
        }
      } else {
        return res.status(400).json({ message: "Failed OpenAI request" });
      }
    } while (continueToken);

    // console.log("completeResponse", completeResponse);
    return res.status(200).json({ message: "Success", data: completeResponse });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
});
module.exports = {
  postOpenAI,
};
