import { Top, TextField, FixedBottomCTA } from "@toss/tds-mobile";
import { useNameInput, hasNonHangul } from "./useNameInput";
import { Disclaimer } from "@/components/Disclaimer";

export function NameInputScreen() {
  const { name1, name2, updateName1, updateName2, isValid, error, submit } =
    useNameInput();

  const name1Error = hasNonHangul(name1);
  const name2Error = hasNonHangul(name2) || !!error;

  return (
    <>
      <Top
        title={
          <Top.TitleParagraph size={28}>
            {"두 사람의 이름을\n알려주세요"}
          </Top.TitleParagraph>
        }
      />

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 16,
          padding: "8px 24px 24px",
        }}
      >
        <TextField
          variant="box"
          label="내 이름"
          labelOption="sustain"
          placeholder="내 이름"
          value={name1}
          onChange={(e) => updateName1(e.target.value)}
          hasError={name1Error}
          help={name1Error ? "한글 이름만 가능해요" : undefined}
        />
        <TextField
          variant="box"
          label="친구 이름"
          labelOption="sustain"
          placeholder="친구 이름"
          value={name2}
          onChange={(e) => updateName2(e.target.value)}
          hasError={name2Error}
          help={name2Error ? "한글 이름만 가능해요" : undefined}
        />
        <Disclaimer />
      </div>

      <FixedBottomCTA onClick={submit} disabled={!isValid}>
        궁합 보기
      </FixedBottomCTA>
    </>
  );
}
