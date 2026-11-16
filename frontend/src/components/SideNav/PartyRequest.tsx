import { useI18n } from "@/hooks/useI18n";

export default function PartyRequest(username: string) {
  const { t } = useI18n();
  return <div>{t("common.invitation")}</div>
}


/*const inviteBox = (userName) => {
  const userRequest = battleRequest.find(
    (request) => request.from == userName,
  );
  return (
    userRequest && (
      <div className="invitation-box">
        <span>{userName} te ha invitado a un enfrentamiento</span>
        <div>
          <button
          >
            Aceptar
          </button>
          <button>Rechazar</button>
        </div>
      </div>
    )
  );
};*/
