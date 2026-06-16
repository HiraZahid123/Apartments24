<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\MessageTemplate;

class MessageTemplateSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $templates = [
            // GUEST REGISTRATION (Check-in Link)
            [
                'type' => 'guest_registration',
                'language' => 'en',
                'subject' => 'Guest Registration - Apartments24 [[APARTMENT_NAME]]',
                'content' => "Hello [GUEST_NAME]!\n\nThank you for choosing Apartments24. We are looking forward to your stay.\n\nTo ensure a smooth arrival, please complete your digital registration before your check-in. This will give you access to your entry codes and arrival instructions.\n\nApartment: [APARTMENT_NAME]\nCheck-in: [CHECKIN_DATE]\n\nClick here to start your digital check-in:\n[CHECKIN_LINK]\n\nIf you have any questions, feel free to reply to this email or contact us via WhatsApp.\n\nBest regards,\nApartments24 Team",
                'is_active' => true,
            ],
            [
                'type' => 'guest_registration',
                'language' => 'et',
                'subject' => 'Külalise registreerimine - Apartments24 [[APARTMENT_NAME]]',
                'content' => "Tere, [GUEST_NAME]!\n\nTäname, et valisite Apartments24. Ootame teid huviga.\n\nSujuva saabumise tagamiseks palume teil enne sisseregistreerimist täita digitaalne registreerimine. See annab teile juurdepääsu sissepääsukoodidele ja saabumise juhistele.\n\nKorter: [APARTMENT_NAME]\nSisseregistreerimine: [CHECKIN_DATE]\n\nKlõpsake siin, et alustada digitaalset sisseregistreerimist:\n[CHECKIN_LINK]\n\nKui teil on küsimusi, võite vastata sellele meilile või võtke meiega ühendust WhatsAppi kaudu.\n\nParimate soovidega,\nApartments24 Meeskond",
                'is_active' => true,
            ],
            [
                'type' => 'guest_registration',
                'language' => 'ru',
                'subject' => 'Регистрация гостя - Apartments24 [[APARTMENT_NAME]]',
                'content' => "Здравствуйте, [GUEST_NAME]!\n\nСпасибо, что выбрали Apartments24. Мы с нетерпением ждем вашего пребывания.\n\nЧтобы обеспечить плавное прибытие, пожалуйста, завершите цифровую регистрацию перед заселением. Это даст вам доступ к кодам входа и инструкциям по прибытию.\n\nКвартира: [APARTMENT_NAME]\nЗаселение: [CHECKIN_DATE]\n\nНажмите здесь, чтобы начать цифровую регистрацию:\n[CHECKIN_LINK]\n\nЕсли у вас есть вопросы, вы можете ответить на это письмо или связаться с нами через WhatsApp.\n\nС наилучшими пожеланиями,\nКоманда Apartments24",
                'is_active' => true,
            ],

            // WELCOME (Access Details)
            [
                'type' => 'welcome',
                'language' => 'en',
                'subject' => 'Welcome to [APARTMENT_NAME] - Access Details',
                'content' => "Welcome to [APARTMENT_NAME]!\n\nWe are excited to have you check in. Here are your access details:\n\n**Access Codes**\nKeybox Code: [KEYBOX_CODE]\n[SMART_LOCK_BLOCK]\n\n**WiFi Details**\nNetwork: [WIFI_SSID]\nPassword: [WIFI_PASSWORD]\n\n**Arrival Instructions**\n[ARRIVAL_INSTRUCTIONS]\n\nEnjoy your stay!\n\nBest regards,\nApartments24",
                'is_active' => true,
            ],
            [
                'type' => 'welcome',
                'language' => 'et',
                'subject' => 'Tere tulemast [APARTMENT_NAME] - Juurdepääsu andmed',
                'content' => "Tere tulemast [APARTMENT_NAME]!\n\nMeil on hea meel teid vastu võtta. Siin on teie juurdepääsu andmed:\n\n**Juurdepääsukoodid**\nVõtmekasti kood: [KEYBOX_CODE]\n[SMART_LOCK_BLOCK]\n\n**WiFi andmed**\nVõrk: [WIFI_SSID]\nParool: [WIFI_PASSWORD]\n\n**Saabumise juhised**\n[ARRIVAL_INSTRUCTIONS]\n\nHead puhkust!\n\nParimate soovidega,\nApartments24",
                'is_active' => true,
            ],
            [
                'type' => 'welcome',
                'language' => 'ru',
                'subject' => 'Добро пожаловать в [APARTMENT_NAME] - Данные доступа',
                'content' => "Добро пожаловать в [APARTMENT_NAME]!\n\nМы рады видеть вас. Вот ваши данные доступа:\n\n**Коды доступа**\nКод ключницы: [KEYBOX_CODE]\n[SMART_LOCK_BLOCK]\n\n**Данные WiFi**\nСеть: [WIFI_SSID]\nПароль: [WIFI_PASSWORD]\n\n**Инструкции по прибытию**\n[ARRIVAL_INSTRUCTIONS]\n\nПриятного пребывания!\n\nС наилучшими пожеланиями,\nApartments24",
                'is_active' => true,
            ],

            // THANK YOU (Checkout)
            [
                'type' => 'thank_you',
                'language' => 'en',
                'subject' => 'Thank you for staying with us!',
                'content' => "Dear [GUEST_NAME],\n\nThank you for staying with us at [APARTMENT_NAME]!\n\nWe hope you had a pleasant stay and enjoyed your time with Apartments24.\n\nSafe travels!\n\nBest regards,\nApartments24 Team",
                'is_active' => true,
            ],
            [
                'type' => 'thank_you',
                'language' => 'et',
                'subject' => 'Täname teid viibimise eest!',
                'content' => "Lugupeetud [GUEST_NAME],\n\nTäname teid, et viibisite meiega [APARTMENT_NAME]!\n\nLoodame, et teil oli meeldiv viibimine ja naudite oma aega Apartments24-ga.\n\nHead reisi!\n\nParimate soovidega,\nApartments24 Meeskond",
                'is_active' => true,
            ],
            [
                'type' => 'thank_you',
                'language' => 'ru',
                'subject' => 'Спасибо за ваше пребывание!',
                'content' => "Уважаемый [GUEST_NAME],\n\nСпасибо, что остановились у нас в [APARTMENT_NAME]!\n\nНадеемся, что вам понравилось ваше пребывание и вы получили удовольствие от времени, проведенного с Apartments24.\n\nСчастливого пути!\n\nС наилучшими пожеланиями,\nКоманда Apartments24",
                'is_active' => true,
            ],

            // CHECKOUT REMINDER
            [
                'type' => 'checkout_reminder',
                'language' => 'en',
                'subject' => 'Check-out Reminder & Easy Checkout Link',
                'content' => "Hello [GUEST_NAME]!\n\nJust a quick reminder that your check-out is on [CHECKOUT_DATE] at 11:00 or earlier.\n\nPlease leave the apartment in good condition upon check-out. It helps us to make it possible to allow earlier check-in for the next guests. We appreciate it if you have time to notify us when you leave the apartment.\n\nThank you for staying with us at [APARTMENT_NAME]!\n\nBest regards,\nApartments24 Team",
                'is_active' => true,
            ],
            [
                'type' => 'checkout_reminder',
                'language' => 'et',
                'subject' => 'Väljaregistreerimise meeldetuletus ja lihtne väljaregistreerimise link',
                'content' => "Tere, [GUEST_NAME]!\n\nKiire meeldetuletus, et teie väljaregistreerimine on [CHECKOUT_DATE] kell 11:00 või varem.\n\nPalun jätke korter heas seisukorras väljaregistreerimisel. See aitab meil võimaldada järgmistele külalistele varasemat sisseregistreerimist. Hindame, kui teil on aega teavitada meid, kui lahkute korterist.\n\nTäname, et viibisite meiega [APARTMENT_NAME]!\n\nParimate soovidega,\nApartments24 Meeskond",
                'is_active' => true,
            ],
            [
                'type' => 'checkout_reminder',
                'language' => 'ru',
                'subject' => 'Напоминание о выселении и простая ссылка для выселения',
                'content' => "Здравствуйте, [GUEST_NAME]!\n\nБыстрое напоминание, что ваше выселение [CHECKOUT_DATE] в 11:00 или раньше.\n\nПожалуйста, оставьте квартиру в хорошем состоянии при выселении. Это помогает нам сделать возможным более раннюю регистрацию для следующих гостей. Мы будем признательны, если у вас будет время сообщить нам, когда вы покинете квартиру.\n\nСпасибо, что остановились у нас в [APARTMENT_NAME]!\n\nС наилучшими пожеланиями,\nКоманда Apartments24",
                'is_active' => true,
            ],
        ];

        foreach ($templates as $template) {
            MessageTemplate::updateOrCreate(
                ['type' => $template['type'], 'language' => $template['language']],
                $template
            );
        }
    }

}
