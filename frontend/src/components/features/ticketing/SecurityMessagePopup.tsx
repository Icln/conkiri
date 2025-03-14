import { useEffect, useState } from 'react';
import Captcha from './Captcha';
import Popup from '@/components/ui/Popup';
import { useSecurityPopupStore } from '@/store/useSecurityPopupStore';

interface SecurityMessagePopupProps {
  isOpen: boolean;
  onPostpone: () => void; // 나중에 입력으로 미루는 경우
  onSuccess: () => void; // 보안 문자 잘 쳐서 들어가는 경우우
}

export default function SecurityMessagePopup({
  isOpen,
  onPostpone,
  onSuccess,
}: SecurityMessagePopupProps) {
  const [captchaText, setCaptchatext] = useState('');
  const [inputText, setInputText] = useState('');
  const [error, setError] = useState(false);
  const setSecurityPopupState = useSecurityPopupStore(
    (state) => state.setSecurityPopupState
  );

  useEffect(() => {
    if (isOpen) {
      generateCaptcha();
    }
  }, [isOpen]);

  if (!isOpen) return null; // 닫혀있으면 null 리턴해서 팝업 닫기

  //텍스트 생성
  const generateCaptcha = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    let result = '';
    for (let i = 0; i < 6; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setCaptchatext(result);
    setInputText('');
  };

  // 음성 읽기 기능
  const speakCaptcha = () => {
    const utterance = new SpeechSynthesisUtterance(captchaText);
    window.speechSynthesis.speak(utterance);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value.toUpperCase();
    setInputText(inputValue);
  };

  // const handleSubmit = () => {
  //   if (captchaText === inputText) {
  //     setSecurityPopupState(true);
  //     onSuccess();
  //   } else {
  //     return setError(true);
  //   }
  // };
  const handleSubmit = () => {
    console.log('handleSubmit 실행됨');
    console.log('captchaText:', captchaText);
    console.log('inputText:', inputText);

    if (captchaText === inputText) {
      console.log('captcha 일치');
      setSecurityPopupState(true);
      console.log('SecurityPopup 상태 업데이트됨');
      onSuccess();
      console.log('onSuccess 호출됨');
    } else {
      console.log('captcha 불일치');
      setError(true);
    }
  };

  return (
    <Popup isOpen className="z-50">
      <div className="text-center">
        <h2 className="text-xl font-bold text-primary-main">인증예매</h2>
      </div>

      <div className="mt-4 space-y-4">
        <p className="text-center text-gray-600">
          부정예매 방지를 위해 보안문자를 정확히 입력해주세요.
        </p>
        <Captcha
          captchaText={captchaText}
          generateCaptcha={generateCaptcha}
          handleInputChange={handleInputChange}
          inputText={inputText}
          speakCaptcha={speakCaptcha}
        />
        {error && (
          <p className="text-status-warning">문자를 정확히 입력하세요</p>
        )}
        <div className="flex justify-center">
          <button
            className="rounded-full bg-primary-main px-12 py-2 text-white"
            onClick={handleSubmit}
          >
            입력 완료
          </button>
        </div>
        <button
          className="inline-block w-full text-center text-sm text-gray-500 underline hover:underline"
          onClick={onPostpone}
        >
          <span>좌석 먼저 확인하고 나중에 입력하기</span>
        </button>
      </div>
    </Popup>
  );
}
