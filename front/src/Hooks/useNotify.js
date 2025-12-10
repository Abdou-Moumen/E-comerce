import { useNotify } from "../contexts/NotifyContext";

export const useNotification = () => {
  const { setNotify } = useNotify();

  const notifyUser = (message, severity) => {
    setNotify({ open: true, message, severity });
  };
  const notifySuccess = (message) => {
    notifyUser(message, "success");
  };

  const notifyError = (errorCode) => {
    let message = "";
    switch (errorCode) {
      case 400:
        message =
          "La requête ne peut être traitée en raison d'une syntaxe mal formée.";

        break;
      case 401:
        message =
          "Vous n'êtes pas autorisé à accéder à cette ressource. Veuillez vérifier vos identifiants.";

        break;
      case 403:
        message = "Vous n'avez pas la permission d'accéder à cette ressource.";

        break;
      case 404:
        message = "La ressource demandée est introuvable sur le serveur.";

        break;
      case 500:
        message =
          "Le serveur a rencontré une condition inattendue qui l'a empêché de répondre à la requête.";

        break;
      default:
        message =
          "Une erreur inattendue s'est produite lors du traitement de votre requête.";

        break;
    }
    notifyUser(message, "error");
  };

  return { notifyUser, notifySuccess, notifyError };
};
