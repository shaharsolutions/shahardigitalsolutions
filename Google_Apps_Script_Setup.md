# הוראות התקנה ל-Google Apps Script

כדי לחבר את הטופס בדף הנחיתה ל-Google Sheets, עליך לבצע את השלבים הבאים:

1. פתח גיליון Google Sheets חדש (או קיים).
2. בתפריט העליון, לחץ על **הרחבות (Extensions)** > **Apps Script**.
3. מחק את כל הקוד הקיים בעורך הקוד, והדבק במקומו את הקוד הבא:

```javascript
function doPost(e) {
  // קבלת הגיליון הפעיל
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  
  // אם הגיליון ריק, הוסף כותרות
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(["זמן שליחה", "שם מלא", "טלפון", "אימייל", "שם העסק", "מה רוצים לשפר"]);
  }
  
  // קריאת הנתונים מהטופס
  // השימוש ב-e.parameter מאפשר לקרוא את הנתונים לפי ה-name שנתנו ב-HTML
  var params = e.parameter;
  
  var fullName = params.fullName || "";
  var phone = params.phone || "";
  var email = params.email || "";
  var businessName = params.businessName || "";
  var improvement = params.improvement || "";
  
  // הוספת שורה חדשה עם הנתונים
  sheet.appendRow([
    new Date(), // חותמת זמן הנוכחית
    fullName,
    phone,
    email,
    businessName,
    improvement
  ]);
  
  // החזרת תשובה לדפדפן (חובה)
  return ContentService.createTextOutput("Success");
}
```

4. **שמירה:** לחץ על אייקון הדיסקט או `Ctrl+S` וניתן שם לפרוייקט (למשל "Landing Page Handler").
5. **פריסה (Deploy):**
   - לחץ על הכפתור הכחול **Deploy** (פריסה) בצד ימין למעלה -> **New deployment**.
   - בתיבה שנפתחת, לחץ על גלגל השיניים (Select type) ובחר **Web app**.
   - מלא את השדות:
     - **Description:** תיאור קצר (לא חובה).
     - **Execute as:** `Me` (הכינוי שלך).
     - **Who has access:** (חשוב מאוד!) שנה ל-**Anyone** (כל אחד). אם זה לא יהיה על Anyone, הטופס לא יוכל לשלוח נתונים.
   - לחץ **Deploy**.
   - ייתכן שתתבקש לאשר הרשאות (Authorize access). אשר אותן (אם מופיעה אזהרה "Google hasn't verified this app", לחץ על `Advanced` ואז על `Go to... (unsafe)`).

6. **העתקת הקישור:**
   - לאחר הפריסה, תקבל כתובת URL (Web App URL).
   - העתק את הכתובת הזו.

7. **עדכון הדף:**
   - פתח את הקובץ `script.js` בתיקייה שנוצרה.
   - בשורה המציינת `const SCRIPT_URL = 'INSERT_YOUR_GOOGLE_APPS_SCRIPT_URL_HERE';`
   - הדבק את הכתובת שהעתקת במקום הטקסט שבגרשיים.
   - שמור את הקובץ.

זהו! כעת כל פעם שמישהו ימלא את הטופס, הנתונים יופיעו בגיליון ושם העסק שהגדרת.
