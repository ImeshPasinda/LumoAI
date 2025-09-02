from langchain_community.document_loaders import PyPDFLoader
from langchain_community.vectorstores import FAISS
from langchain_openai import OpenAIEmbeddings, ChatOpenAI
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain.chains import RetrievalQA

class ChatbotQA:
    def __init__(self, pdf_path: str, openai_api_key: str):
        self.pdf_path = pdf_path
        self.openai_api_key = openai_api_key
        self.qa_chain = self._initialize_qa_chain()

    def _initialize_qa_chain(self):
        # Load and split PDF
        loader = PyPDFLoader(self.pdf_path)
        documents = loader.load()
        text_splitter = RecursiveCharacterTextSplitter(chunk_size=1000, chunk_overlap=200)
        texts = text_splitter.split_documents(documents)

        # Initialize embeddings and vector store
        embeddings = OpenAIEmbeddings(openai_api_key=self.openai_api_key)
        db = FAISS.from_documents(texts, embeddings)

        # Initialize LLM and QA chain
        llm = ChatOpenAI(model_name="gpt-3.5-turbo", openai_api_key=self.openai_api_key)
        qa = RetrievalQA.from_chain_type(
            llm=llm, 
            chain_type="stuff", 
            retriever=db.as_retriever()
        )
        return qa

    def ask_question(self, question: str, history: list = None) -> str:
        try:
            if history:
                # Merge past messages into a single context string
                history_context = "\n".join(
                    [f"{m['role'].capitalize()}: {m['content']}" for m in history]
                )
                prompt = f"{history_context}\nUser: {question}\nAssistant:"
            else:
                prompt = question

            result = self.qa_chain.invoke({"query": prompt})
            return result['result']
        except Exception as e:
            print(f"Error in QA chain: {e}")
            raise e