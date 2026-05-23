/**
 * API функции для аутентификации и регистрации
 * Эти функции работают с вымышленным бэкендом
 * В реальном проекте нужно заменить на реальные endpoints
 */

interface RegisterRequest {
  username: string;
  email: string;
  password: string;
}

interface RegisterResponse {
  success: boolean;
  message: string;
  verificationId?: string; // ID для отслеживания попытки регистрации
}

interface VerifyCodeRequest {
  verificationId: string;
  code: string;
}

interface AuthResponse {
  success: boolean;
  message: string;
  token?: string;
  user?: {
    id: string;
    username: string;
    email: string;
  };
}

/**
 * Отправить запрос на регистрацию
 * Вернет ID для подтверждения и отправит код на почту
 */
export async function registerUser(data: RegisterRequest): Promise<RegisterResponse> {
  try {
    // В реальном приложении это будет POST на твой бэкенд
    // Здесь для демонстрации генерируем вымышленный ID
    const verificationId = Math.random().toString(36).slice(2);
    
    // Имитируем задержку сети
    await new Promise(r => setTimeout(r, 1000));

    // В реальности здесь был бы fetch:
    // const res = await fetch('/api/auth/register', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(data)
    // });
    // const result = await res.json();
    // return result;

    return {
      success: true,
      message: 'Код подтверждения отправлен на почту',
      verificationId
    };
  } catch (error) {
    return {
      success: false,
      message: 'Ошибка регистрации. Попробуйте снова.'
    };
  }
}

/**
 * Проверить код подтверждения и завершить регистрацию
 */
export async function verifyCode(req: VerifyCodeRequest): Promise<AuthResponse> {
  try {
    // Имитируем проверку кода (в реальности это POST на бэкенд)
    await new Promise(r => setTimeout(r, 800));

    // Вымышленная проверка: код должен быть 6 цифр
    if (!/^\d{6}$/.test(req.code)) {
      return {
        success: false,
        message: 'Неверный формат кода'
      };
    }

    // В реальности здесь был бы fetch:
    // const res = await fetch('/api/auth/verify-code', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(req)
    // });
    // const result = await res.json();

    // Вымышленный успешный ответ
    const fakeToken = btoa(JSON.stringify({
      userId: Math.random().toString(36).slice(2),
      timestamp: Date.now()
    }));

    return {
      success: true,
      message: 'Регистрация успешна!',
      token: fakeToken,
      user: {
        id: Math.random().toString(36).slice(2),
        username: 'user_' + Math.random().toString(36).slice(2, 8),
        email: 'user@example.com'
      }
    };
  } catch (error) {
    return {
      success: false,
      message: 'Ошибка при проверке кода'
    };
  }
}

/**
 * Обработка входа через Google OAuth
 * В реальности используй @react-oauth/google или similiar library
 */
export async function loginWithGoogle(googleToken: string): Promise<AuthResponse> {
  try {
    // Отправляем токен на бэкенд для верификации
    // const res = await fetch('/api/auth/google', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({ token: googleToken })
    // });
    // const result = await res.json();

    // Вымышленный успешный ответ
    const fakeToken = btoa(JSON.stringify({
      userId: Math.random().toString(36).slice(2),
      provider: 'google',
      timestamp: Date.now()
    }));

    return {
      success: true,
      message: 'Успешный вход через Google',
      token: fakeToken,
      user: {
        id: Math.random().toString(36).slice(2),
        username: 'google_user',
        email: 'user@gmail.com'
      }
    };
  } catch (error) {
    return {
      success: false,
      message: 'Ошибка входа через Google'
    };
  }
}
