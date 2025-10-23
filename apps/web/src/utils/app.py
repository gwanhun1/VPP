import gradio as gr
from transformers import AutoModelForCausalLM, AutoTokenizer, BitsAndBytesConfig
import torch

# 모델 설정
MODEL_REPO_ID = "jungfgsds/vpp"

print(f"🔄 모델 로딩 중: {MODEL_REPO_ID}")

# CPU/GPU 자동 감지
device = "cuda" if torch.cuda.is_available() else "cpu"
print(f"🖥️ 사용 중인 디바이스: {device}")

# 모델과 토크나이저 로딩
if device == "cuda":
    quantization_config = BitsAndBytesConfig(
        load_in_4bit=True,
        bnb_4bit_compute_dtype=torch.float16
    )
    model = AutoModelForCausalLM.from_pretrained(
        MODEL_REPO_ID,
        quantization_config=quantization_config,
        device_map="auto",
        trust_remote_code=True
    )
else:
    model = AutoModelForCausalLM.from_pretrained(
        MODEL_REPO_ID,
        torch_dtype=torch.float32,
        low_cpu_mem_usage=True,
        trust_remote_code=True
    )
    model = model.to(device)

tokenizer = AutoTokenizer.from_pretrained(MODEL_REPO_ID, trust_remote_code=True)

print(f"✅ 모델 로딩 완료!")

def generate(message):
    """간단한 텍스트 생성 함수 - message만 받음"""
    try:
        messages = [{"role": "user", "content": message}]
        
        if hasattr(tokenizer, 'apply_chat_template'):
            inputs = tokenizer.apply_chat_template(
                messages, 
                tokenize=True, 
                add_generation_prompt=True, 
                return_tensors="pt"
            )
        else:
            inputs = tokenizer.encode(message, return_tensors="pt")
        
        inputs = inputs.to(device)
        
        with torch.no_grad():
            outputs = model.generate(
                input_ids=inputs, 
                max_new_tokens=512,
                temperature=0.7,
                do_sample=True,
                pad_token_id=tokenizer.eos_token_id
            )
        
        response = tokenizer.decode(
            outputs[0][inputs.shape[1]:], 
            skip_special_tokens=True
        )
        
        return response
    
    except Exception as e:
        return f"오류: {str(e)}"

# Gradio 인터페이스 - API 엔드포인트만 제공
demo = gr.Interface(
    fn=generate,
    inputs=gr.Textbox(label="message"),
    outputs=gr.Textbox(label="response"),
    title="LLM API",
    api_name="generate"
)

# Queue 활성화하여 실행
demo.queue().launch()