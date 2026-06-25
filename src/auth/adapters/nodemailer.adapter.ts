import nodemailer from 'nodemailer';
import { SETTINGS } from '../../core/settings/settings';

/*Адаптер для работы с библиотекой nodemailer.*/
export const nodemailerAdapter = {
  /*Метод для отправки писем.*/
  async sendMail(emailTo: string, subject: string, code: string, template: (code: string) => string): Promise<boolean> {
    try {
      /*Создаем транспортер - механизм для работы с почтой. В параметрах метода конфигурируем создаваемый транспортер.*/
      const transporter = nodemailer.createTransport({
        /*Имя почтового сервиса.*/
        service: 'gmail',
        auth: {
          /*Адрес почты, используемый для отправки писем.*/
          user: SETTINGS.EMAIL,
          /*Пароль приложения из Google.*/
          pass: SETTINGS.EMAIL_APP_PASS,
        },
      });

      /*Формируем объект с данными для письма и отправляем письмо через созданный транспортер.*/
      const info = await transporter.sendMail({
        /*Адрес отправителя.*/
        from: `"Bloggers Backend App" <${SETTINGS.EMAIL}>`,
        /*Адрес получателя.*/
        to: emailTo,
        /*Тема письма.*/
        subject: subject,
        /*Тело письма в виде HTML.*/
        html: template(code), // html body
        /*Тело письма в виде текста.*/
        // text: "Did you ever ask for this?"
      });

      // console.log(info);
      return !!info;
    } catch (error) {
      throw error;
    }
  },
};
