package model

import (
	"errors"
	"log"
	"reflect"
	"regexp"
	"strings"
	"time"

	"github.com/go-playground/validator/v10"
	"github.com/google/uuid"
)

type Board struct {
	ID        string     `json:"id,omitempty"`
	Title     string     `json:"title"`
	Owner     string     `json:"owner"`
	Data      string     `json:"data"`
	Password  *string    `json:"password,omitempty"`
	Deleted   *time.Time `json:"deleted,omitempty"`
	CreatedAt time.Time  `json:"created_at,omitempty"`
}

// Exported for use in controller
func GetValidator() *validator.Validate {
	var validate = validator.New(validator.WithRequiredStructEnabled())
	err := validate.RegisterValidation("type-string", isString)
	if err != nil {
		panic(err)
	}

	err = validate.RegisterValidation("isUUID", isValidUUID)
	if err != nil {
		panic(err)
	}

	err = validate.RegisterValidation("isLatinOnly", IsLatinOnly)
	if err != nil {
		panic(err)
	}

	err = validate.RegisterValidation("notOnlyWhitespace", notOnlyWhitespace)
	if err != nil {
		panic(err)
	}

	return validate
}

func notOnlyWhitespace(fl validator.FieldLevel) bool {
	value := fl.Field().String()
	return strings.TrimSpace(value) != ""
}

func IsLatinOnly(fl validator.FieldLevel) bool {
	// Allow only Latin script letters, numbers, punctuation, symbols, spaces
	re := regexp.MustCompile(`^[\p{Latin}\p{N}\p{P}\p{S}\p{Zs}]+$`)
	return re.MatchString(fl.Field().String())
}

func isValidUUID(fl validator.FieldLevel) bool {
	err := uuid.Validate(fl.Field().String())
	isValid := err == nil
	return isValid
}

func isString(fl validator.FieldLevel) bool {
	field := fl.Field()
	// Check if the field's kind is reflect.String
	return field.Kind() == reflect.String
}

// Exported for use in controller
func ValidateMapCustom(validate *validator.Validate, body map[string]any, rulesMap map[string]any) error {
	for key := range rulesMap {

		// Skip validation if field is omitnil and not present in body
		if strings.Contains(rulesMap[key].(string), "omitnil") {
			if _, exists := body[key]; !exists {
				continue
			}
		}

		err := validate.Var(body[key], rulesMap[key].(string))
		if err != nil {
			if _, ok := err.(*validator.InvalidValidationError); ok {
				log.Printf("Invalid validation error: %v", err.Error())
				return err
			}
			if _, ok := err.(validator.ValidationErrors); ok {
				return errors.New(ValidationErrorOnField(key, err.(validator.ValidationErrors)[0].ActualTag()))
			}
		}

	}
	// Check for extra fields in body that aren't in rules
	for key := range body {
		if _, exists := rulesMap[key]; !exists {
			return errors.New(UnexpectedFieldError(key))
		}
	}

	return nil
}
