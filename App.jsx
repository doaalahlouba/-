import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import axios from "axios";

export default function AIArabicDictionary() {
  const [word, setWord] = useState("");
  const [definition, setDefinition] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    setLoading(true);
    try {
      const response = await axios.post("https://api.openai.com/v1/chat/completions", {
        model: "gpt-4",
        messages: [
          { role: "system", content: "أنت معجم لغوي عربي. أعطني المعنى الفصيح، وشرحًا مبسطًا، وجملة مثال للكلمة التالية." },
          { role: "user", content: word }
        ]
      }, {
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer YOUR_OPENAI_API_KEY`
        }
      });

      const content = response.data.choices[0].message.content;
      setDefinition({
        original: `الكلمة: ${word}`,
        meaning: content
      });
    } catch (error) {
      setDefinition({
        original: `الكلمة: ${word}`,
        meaning: "حدث خطأ أثناء جلب المعنى. تأكد من الاتصال أو المفتاح الصحيح."
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-4 space-y-4">
      <h1 className="text-2xl font-bold text-center">المعجم الوسيط الذكي</h1>
      <Input
        placeholder="أدخل الكلمة هنا..."
        value={word}
        onChange={(e) => setWord(e.target.value)}
        className="text-right"
      />
      <Button onClick={handleSearch} disabled={loading}>
        {loading ? "جارٍ البحث..." : "بحث"}
      </Button>

      {definition && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="space-y-3"
        >
          <Card>
            <CardContent className="p-4 space-y-2 text-right">
              <p>{definition.original}</p>
              <p><strong>النتيجة:</strong><br />{definition.meaning}</p>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </div>
  );
}