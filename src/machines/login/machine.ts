import {setup, raise, createMachine} from "xstate";

export const machine = setup({
  types: {
    context: {} as {},
    events: {} as
        | { type: "sms" }
        | { type: "TOTP" }
        | { type: "sent" }
        | { type: "email" }
        | { type: "noMFA" }
        | { type: "hasMFA" }
        | { type: "dismiss" }
        | { type: "hasError" }
        | { type: "codeInvalid" }
        | { type: "codeIsValid" }
        | { type: "errorSending" }
        | { type: "accountLocked" }
        | { type: "chooseMFAOption" }
        | { type: "credentialsValid" }
        | { type: "invalidCredentials" }
        | { type: "provideCredentials" },
  },
  actions: {
    gatherCredentials: function gatherCredentials(
        { context },
        event,
    ) {},
    showError: raise({
      type: "hasError",

    }),
  },
  actors: {
    login: createMachine({
      /* ... */
    }),
    fetchMFATypes: createMachine({
      /* ... */
    }),
  },
  schemas: {
    events: {
      "": {
        type: "object",
        properties: {},
      },
      sms: {
        type: "object",
        properties: {},
      },
      TOTP: {
        type: "object",
        properties: {},
      },
      sent: {
        type: "object",
        properties: {},
      },
      email: {
        type: "object",
        properties: {},
      },
      noMFA: {
        type: "object",
        properties: {},
      },
      hasMFA: {
        type: "object",
        properties: {},
      },
      dismiss: {
        type: "object",
        properties: {},
      },
      hasError: {
        type: "object",
        properties: {},
      },
      codeInvalid: {
        type: "object",
        properties: {},
      },
      codeIsValid: {
        type: "object",
        properties: {},
      },
      errorSending: {
        type: "object",
        properties: {},
      },
      accountLocked: {
        type: "object",
        properties: {},
      },
      chooseMFAOption: {
        type: "object",
        properties: {},
      },
      credentialsValid: {
        type: "object",
        properties: {},
      },
      invalidCredentials: {
        type: "object",
        properties: {},
      },
      provideCredentials: {
        type: "object",
        properties: {},
      },
    },
  },
}).createMachine({
  context: {},
  id: "Login",
  type: "parallel",
  states: {
    ErrorDisplay: {
      initial: "NotVisible",
      states: {
        NotVisible: {
          on: {
            hasError: {
              target: "Visible",
            },
          },
        },
        Visible: {
          on: {
            dismiss: {
              target: "NotVisible",
            },
          },
        },
      },
    },
    Login: {
      initial: "NotAuthenticated",
      states: {
        NotAuthenticated: {
          on: {
            provideCredentials: {
              target: "ValidateCredentials",
            },
          },
          description: "User is not logged in",
        },
        ValidateCredentials: {
          on: {
            invalidCredentials: {
              target: "CredentialsInvalid",
              description: "Credentials were not valid",
            },
            credentialsValid: {
              target: "CheckMFA",
              description: "User and password match an active, non-locked user",
            },
            accountLocked: {
              target: "AccountLocked",
            },
          },

          invoke: {
            id: "login",
            input: {
              password: "",
              username: "",
            },
            src: "login",
          },
          description: "Send credentials to session API",
        },
        CredentialsInvalid: {
          always: {
            target: "NotAuthenticated",
          },

        },
        CheckMFA: {
          on: {
            noMFA: {
              target: "UserAuthenticated",
              description: "User has no enrolled MFA types",
            },
            hasMFA: {
              target: "ShowMFAOptions",
              description: "User has one or more MFA types enrolled",
            },
            hasError: {
              target: "CheckMFAFailed",
              description: "API Call failed",
            },
          },
          invoke: {
            input: {},
            src: "fetchMFATypes",
          },
          description: "API Call to fetch user's enrolled MFA types",
        },
        AccountLocked: {
          always: {
            target: "NotAuthenticated",
          },

        },
        UserAuthenticated: {
          type: "final",
        },
        ShowMFAOptions: {
          on: {
            chooseMFAOption: {
              target: "ProcessMFA",
            },
          },
          description: "Show enrolled MFA options",
        },
        CheckMFAFailed: {
          always: {
            target: "NotAuthenticated",
          },
        },
        ProcessMFA: {
          initial: "MFAChoice",
          states: {
            MFAChoice: {
              on: {
                TOTP: {
                  target: "GatherCode",
                },
                email: {
                  target: "SendEmailMFA",
                },
                sms: {
                  target: "SendSMSMFA",
                },
              },
              description: "What MFA did the user pick?",
            },
            GatherCode: {
              always: {
                target: "ValidateCode",
              },
              description: "User provides MFA code from the method  they chose",
            },
            SendEmailMFA: {
              on: {
                sent: {
                  target: "GatherCode",
                },
                errorSending: {
                  target: "#Login.Login.ShowMFAOptions",
                },
              },
              description:
                  "Tell the server to send an MFA email for the ID they picked",
            },
            SendSMSMFA: {
              on: {
                sent: {
                  target: "GatherCode",
                },
                errorSending: {
                  target: "#Login.Login.ShowMFAOptions",
                },
              },
              description:
                  "Tell the server to send an MFA SMS for the ID they picked",
            },
            ValidateCode: {
              on: {
                codeIsValid: {
                  target: "#Login.Login.UserAuthenticated",
                },
                codeInvalid: {
                  target: "#Login.Login.MFAFailed",
                },
              },
              description:
                  "Send MFA choice and MFA code to server for validation",
            },
          },
        },
        MFAFailed: {
          always: {
            target: "ShowMFAOptions",
          },
        },
      },
    },
  },
});