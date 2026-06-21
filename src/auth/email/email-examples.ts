/*Шаблоны email.*/
export const emailExamples = {
  /*Шаблон письма для подтверждения по коду регистрации пользователя.*/
  completeRegistrationEmail(code: string) {
    return `<h1>Thank you for your registration</h1>
            <p>To finish your registration please follow the link below:<br>
              <a href='https://somesite.com/confirm-email?code=${code}'>Complete Registration</a>
            </p>`;
  },

  /*Шаблон письма для восстановления пароля пользователя.*/
  passwordRecoveryEmail(code: string) {
    return `<h1>Password recovery</h1>
            <p>To finish your password recovery please follow the link below:
              <a href='https://somesite.com/password-recovery?recoveryCode=${code}'>Recover Password</a>
            </p>`;
  },
};
