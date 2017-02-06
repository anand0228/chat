from flask import Flask, request
from flask_restful import Resource, Api
from chatterbot import  ChatBot
from chatterbot.trainers import ChatterBotCorpusTrainer

app = Flask(__name__)
api= Api(app)


class HelloWorld(Resource):

       chatbot = ChatBot("test",
                  logic_adapters=[
                    {
                       'import_path': 'chatterbot.logic.BestMatch'
                    },
                    {
                       'import_path' : 'chatterbot.logic.LowConfidenceAdapter',
                       'threshold' : 0.65,
                       'default_response': 'I am sorry I do not understand the question'
                        
                    }
                  ],
                  input_adapter="chatterbot.input.VariableInputTypeAdapter",
                  output_adapter="chatterbot.output.OutputAdapter",
                  database="../database.db"
       )

       chatbot.set_trainer(ChatterBotCorpusTrainer);

       chatbot.train(
       	        "chatterbot.corpus.techm.hr"
       )

       def post(self):
              chat_session_id=request.form['session']
              chat_session = self.chatbot.conversation_sessions.get(chat_session_id, None)

              if not chat_session:
                  chat_session=self.chatbot.conversation_sessions.new()
                   
              formdata=request.form['data']
              response=self.chatbot.get_response(formdata, chat_session.id_string)
              return { 'session' : chat_session.id_string,
                       'response' : str(response)}

api.add_resource(HelloWorld, '/')

if __name__ == '__main__':
     app.run(debug=True)
