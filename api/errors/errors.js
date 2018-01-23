exports.errors = {
  default: {
    BAD_PARAMS: {
      desc: {
        code: "BAD_PARAMS",
        message: "Your query contains bad parameters."
      },
      status: 400
    },
    NOT_FOUND: {
      desc: {
        code: "NOT_FOUND",
        message: "The resource you're trying to access doesn't exist."
      },
      status: 404
    },
    DEFAULT: {
      desc: {
        code: "ERROR",
        message: "An error occured during the request."
      },
      status: 500
    },
    ALREADY_EXISTS: {
      desc: {
        code: "ALREADY_EXISTS",
        message: "The resource you're trying to create already exists."
      },
      status: 409
    },
    FORBIDDEN: {
      desc: {
        code: "FORBIDDEN",
        message: "The action you're trying to achieve is forbidden."
      },
      status: 403
    }
  },
  auth: {
    NOT_AUTH: {
      desc: {
        code: "NOT_AUTH",
        message: "This resource is only available for authenticated users."
      },
      status: 401
    },
    UNAUTHORIZED: {
      desc: {
        code: "UNAUTHORIZED",
        message: "This user cannot access to the resource."
      },
      status: 403
    },
    WRONG_CREDS: {
      desc: {
        code: "WRONG_CREDENTIALS",
        message: "The credentials sent don't match any existing resource."
      },
      status: 405
    }
  },
  team: {
    ALREADY_HAS_TEAM: {
      desc: {
        code: "UNAUTHORIZED",
        message: "This user already has a team."
      },
      status: 403
    }
  }
}
