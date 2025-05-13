package model

// Centralized user-facing error messages
var ErrorMessages = struct {
	NotFound                string
	BadRequest              string
	Unauthorized            string
	Forbidden               string
	InternalServerError     string
	InvalidRequestBody      string
	DataMustBeValidJSON     string
	AtLeastOneFieldRequired string
	OwnerNotFound           string
}{
	NotFound:                "entity not found",
	BadRequest:              "bad request",
	Unauthorized:            "unauthorized",
	Forbidden:               "forbidden",
	InternalServerError:     "internal server error",
	InvalidRequestBody:      "Invalid request body",
	DataMustBeValidJSON:     "data must be valid JSON",
	AtLeastOneFieldRequired: "at least one of title, data, password is required",
	OwnerNotFound:           "owner not found",
}

// Dynamic error message generators
func ValidationErrorOnField(field, tag string) string {
	return "validation error on field: " + field + ", failed on tag " + tag
}

func UnexpectedFieldError(field string) string {
	return "unexpected field in request body: " + field
}
