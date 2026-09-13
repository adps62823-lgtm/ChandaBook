# 🔱 माँ दुर्गा पूजा चंदा बुक (ChandaBook) — रौज़ा रोड, सासाराम (बिहार)
### Zero-Cost (Pennyless), Deployment-Ready Web Application for Durga Puja Pandal Chanda Collection Team

An all-in-one web portal crafted specifically for the Durga Puja Pandal committee volunteers stationed at **Rouza Road, Sasaram**. Designed for instant, frictionless collection recording on mobile phones or desktops with zero hosting or database expenses.

---

## ✨ मुख्य विशेषताएं (Key Features)

1. **एक बार लॉगिन (1-Time Persistent Login)**:
   - 4 उपयोगकर्ता खाते: **User 1, User 2, User 3, User 4**
   - 4-अंकों का सरल सुरक्षा पिन
   - **स्थानीय संग्रहण (LocalStorage Persistence)**: एक बार लॉगिन करने के बाद सत्र हमेशा सुरक्षित रहता है (ब्राउज़र बंद होने या फ़ोन रीस्टार्ट होने पर भी), जब तक स्वयं "लॉग आउट" न किया जाए।

2. **स्वचालित उपयोगकर्ता टैगिंग (Automatic User Tagging)**:
   - हर रसीद पर लॉग-इन उपयोगकर्ता (User 1-4) का नाम स्वचालित रूप से टैग हो जाता है।
   - पारदर्शिता हेतु समिति बहीखाता और लीडरबोर्ड पर प्रत्येक सदस्य का कुल संग्रह प्रदर्शित होता है।

3. **मानचित्र आधारित संग्रह लॉगिंग (Map-Based Collection Logging)**:
   - **100% निःशुल्क OpenStreetMap एवं Leaflet** (कोई गूगल मैप्स क्रेडिट कार्ड या API की आवश्यकता नहीं)।
   - रौज़ा रोड सासाराम (`24.9536° N, 84.0278° E`) पर केंद्रित।
   - "📍 वर्तमान स्थान लें" (GPS Geolocation) बटन से वास्तविक स्थिति स्वचालित रूप से रिकॉर्ड होती है।
   - नक्शे पर सभी चंदा स्थलों के रंग-बिरंगे पिन (नकद / UPI) और रसीद विवरण।

4. **विस्तृत पृथक बहीखाता (Separate Textual Log Book)**:
   - दाता का नाम, मोबाइल नंबर, रसीद संख्या, या पते से त्वरित खोज (Live Search)।
   - उपयोगकर्ता, भुगतान माध्यम (Cash/UPI) और तिथि के अनुसार फ़िल्टर।
   - **एक-क्लिक CSV/Excel निर्यात**: समिति के हिसाब-किताब के लिए संपूर्ण डेटा डाउनलोड।

5. **डिजिटल रसीद एवं WhatsApp शेयर (Digital Receipt & WhatsApp Share)**:
   - पारंपरिक भव्य दुर्गा पूजा रसीद पर्ची (Printable A4 / Thermal format)।
   - **WhatsApp शेयर बटन**: एक टैप में दाता के मोबाइल पर पूरी रसीद का विवरण एवं माता रानी का आशीर्वाद संदेश।
   - पंडाल का UPI QR कोड स्क्रीन पर ही दिखाने की सुविधा।

---

## 👥 उपयोगकर्ता एवं लॉगिन पिन (Users & Default PINs)

| उपयोगकर्ता (User) | डिफ़ॉल्ट पिन (Default PIN) |
| :--- | :--- |
| **User 1** | `1001` |
| **User 2** | `1002` |
| **User 3** | `1003` |
| **User 4** | `1004` |

---

## 🚀 100% निःशुल्क परिनियोजन निर्देश (Pennyless Deployment Guide)

### चरण 1: MongoDB Atlas (मुफ़्त डेटाबेस - 2 मिनट)
1. [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas) पर जाएं और निःशुल्क खाता बनाएं।
2. **"M0 Free Tier"** क्लस्टर चुनें (यह हमेशा के लिए 100% फ्री है, कोई क्रेडिट कार्ड नहीं चाहिए)।
3. Database Access में जाकर एक उपयोगकर्ता (उदा. `sasaram_admin`) और पासवर्ड बनाएं।
4. Network Access में **"Allow Access from Anywhere"** (`0.0.0.0/0`) जोड़ें (ताकि Vercel कनेक्ट कर सके)।
5. "Connect" पर क्लिक करें -> "Drivers" चुनें -> अपनी कनेक्शन स्ट्रिंग कॉपी करें:
   `mongodb+srv://sasaram_admin:<password>@cluster0.xxxx.mongodb.net/durga_puja_chanda_sasaram?retryWrites=true&w=majority`

> **ध्यान दें**: यदि आप अभी MongoDB URI नहीं भी डालते हैं, तो भी ऐप बिना किसी एरर के इन-मेमोरी/लोकल स्टोर पर तुरंत काम करता है!

---

### चरण 2: Vercel पर 1-क्लिक होस्टिंग (मुफ़्त)
1. इस रिपॉजिटरी को GitHub पर पुश करें:
   ```bash
   git add .
   git commit -m "Configure clean production users and zero dummy data"
   git push origin main
   ```
2. [vercel.com](https://vercel.com) पर जाएं (GitHub से लॉगिन करें)।
3. **"Add New Project"** पर क्लिक करें और इस रिपॉजिटरी को चुनें।
4. **Environment Variables** में:
   - `MONGODB_URI`: अपनी MongoDB Atlas कनेक्शन स्ट्रिंग डालें।
5. **"Deploy"** बटन दबाएं। 60 सेकंड में आपकी वेबसाइट लाइव हो जाएगी!

---

## 💻 स्थानीय विकास (Local Run)

```bash
# 1. विकास सर्वर चलाएं
npm run dev
```
ब्राउज़र में खोलें: [http://localhost:3000](http://localhost:3000)

---

## 📍 रौज़ा रोड सासाराम प्रमुख स्थल (Preloaded Landmarks)
- रौज़ा शरीफ / गेट के पास (Near Rouza Sharif Gate)
- रौज़ा रोड चौक (Rouza Road Chowk)
- जी.टी. रोड मोड़ (G.T. Road Turn)
- एस.पी. जैन कॉलेज रोड क्रॉसिंग (SP Jain College Road Crossing)
- धर्मशाला रोड जंक्शन (Dharmshala Road Junction)
- मुख्य बाज़ार रौज़ा बाज़ार (Main Market Rouza Bazar)
- कचेहरी रोड लिंक (Kachari Road Link)
- फज़लगंज मोड़ (Fazalganj Turning)
- माँ दुर्गा मंडप परिसर (Pandal Site)

---
*॥ जय माता दी • रौज़ा रोड दुर्गा पूजा समिति, सासाराम (रोहतास), बिहार ॥*
