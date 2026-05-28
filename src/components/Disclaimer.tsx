import { Text } from "@toss/tds-mobile";
import { colors } from "@toss/tds-colors";
import { DISCLAIMER } from "@/content/legal";

/** "재미용 콘텐츠예요 😊" 면책 문구 (검수 통과 필수 — 모든 화면 노출) */
export function Disclaimer() {
  return (
    <Text style={{ color: colors.grey500, fontSize: 13, lineHeight: "20px" }}>
      {DISCLAIMER}
    </Text>
  );
}
