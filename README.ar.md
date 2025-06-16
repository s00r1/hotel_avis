<div dir="rtl">

# أداة الإبلاغ وإبداء الرأي

هذا المشروع الصغير يقدِّم استمارة تمكِّن النزلاء من الإبلاغ عن مشكلة تقنية أو ترك رأي بخصوص إقامتهم في الفندق. يُرسَل محتوى الاستمارة عبر **Formspree** ثم يتيح زر تنزيل ملف PDF موجز بفضل مكتبة **jsPDF**.

بعد الإرسال بنجاح يظهر زر **تحميل الاستمارة** لتوليد هذا الملف عند الطلب.

## نظرة عامة شاملة

تم تصميم هذه الأداة لتبسيط جمع الملاحظات داخل الفندق:

- **HTML/CSS/JavaScript** توفِّر الواجهة ومنطق الاستمارة؛
- **Formspree** يستقبل البيانات ويرسلها بالبريد الإلكتروني؛
- **jsPDF** يُنشئ محليًا ورقة بصيغة PDF يمكن تنزيلها بعد التأكيد.

يعمل التطبيق من دون اعتماد على خادم؛ فكل المنطق على جهة العميل ويتم التخزين المؤقت للتفضيلات (السِّمة) في `localStorage`.

## استنساخ المستودع

```bash
git clone <URL-du-dépôt>
cd hotel_avis
npm install
```

تقوم هذه الأوامر خصوصًا بتنزيل `jest` و`eslint` اللازمين لتشغيل `npm test` و`npm run lint`. احرص على توفر اتصال بالشبكة خلال هذه الخطوة، ثم يمكنك تشغيل الاختبارات والمحلل:

```bash
npm test
npm run lint
```

## فتح التطبيق

يكفي بعد ذلك فتح ملف `index.html` في متصفحك:

```bash
xdg-open index.html  # أو انقر مرتين على الملف من مدير الملفات
```

يوجد زر صغير في أعلى يمين الصفحة يسمح بالتبديل بين نسق فاتح ونسق داكن. يُحفظ الاختيار في `localStorage` ليُسترجع في الزيارات اللاحقة.

## إصدار jsPDF

تقوم الصفحة بتحميل **jsPDF** بالإصدار **2.5.1**:

```html
<script src="https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js"></script>
```

## دليل: إعداد Formspree

اتبع الخطوات التالية كي تصل الاستمارة إلى بريدك الإلكتروني:

1. توجَّه إلى [Formspree](https://formspree.io/) وأنشئ حسابًا.
2. فعِّل عنوان البريد الإلكتروني المستخدم أثناء التسجيل (يرسل Formspree رابط تأكيد).
3. في لوحة التحكم، أنشئ استمارة جديدة. يزوّدك Formspree بعنوان من الشكل `https://formspree.io/f/abcde123`.
4. افتح `index.html` وعدّل خاصية `action` في الاستمارة بهذا العنوان:
   ```html
   <form id="mainForm" action="https://formspree.io/f/abcde123" method="POST">
   ```
5. لعرض صفحة مخصّصة بعد الإرسال، أزل التعليق عن الحقل `_next` أو أضفه:
   ```html
   <input type="hidden" name="_next" value="https://votresite.exemple/merci.html">
   ```

## كيفية إرسال البيانات إلى Formspree

يتولّى الملف `script.js` الاتصال الشبكي عند إرسال الاستمارة. تنجز السطور 491 إلى 504 تحديدًا:

1. **جلب الاستمارة وبياناتها**
   ```javascript
   const form = document.getElementById('mainForm');
   const formData = new FormData(form);
   const formAction = form.getAttribute('action');
   ```
2. **الإرسال عبر AJAX** باستخدام `fetch` إلى عنوان Formspree:
   ```javascript
   fetch(formAction, {
     method: 'POST',
     body: formData,
     headers: { 'Accept': 'application/json' }
   }).then(response => {
   ```
3. **معالجة الاستجابة**: إذا تم كل شيء بنجاح (`response.ok`)، يعرض التطبيق زر التنزيل ويعيد ضبط الاستمارة:
   ```javascript
   if (response.ok) {
     lastSubmissionData = { nom, chambre, multi: JSON.parse(JSON.stringify(multi)), codeInter };
     document.getElementById('download-btn').classList.remove('hidden');
     document.getElementById('mainForm').reset();
     // ... إعادة تعيين المتغيّرات الداخلية ...
   }
   ```
   عند وقوع خطأ أو مشكلة في الشبكة، يظهر تنبيه لإخطار المستخدم.

## الترخيص

يوزَّع هذا المشروع بموجب رخصة [MIT](LICENSE). تتوفر نسخ أخرى من هذا الملف بالفرنسية والإنجليزية في [README.md](README.md) و[README.en.md](README.en.md).

</div>
