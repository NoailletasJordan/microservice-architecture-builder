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
	"microservice-architecture-builder/backend/helpers"
)

type Board struct {
	ID            string     `json:"id,omitempty"`
	Title         string     `json:"title"`
	Owner         string     `json:"owner"`
	Data          string     `json:"data"`
	Password      *string    `json:"password,omitempty"`
	DeletedAt     *time.Time `json:"deleted_at,omitempty"`
	CreatedAt     time.Time  `json:"created_at,omitempty"`
	ShareFragment *string    `json:"share_fragment,omitempty"`
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

	err = validate.RegisterValidation("isLatinOnly", isLatinOnly)
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

func isLatinOnly(fl validator.FieldLevel) bool {
	// Allows Latin letters, numbers, punctuation, common symbols, and space
	// Explicitly disallows emoji (typically outside BMP or in \p{So})
	re := regexp.MustCompile(`^[\p{Latin}\p{N}\p{P}\p{Zs}\p{Sm}\p{Sc}\p{Sk}]+$`)
	str := fl.Field().String()

	if !re.MatchString(str) {
		return false
	}

	// Extra emoji ban: catch Unicode characters in typical emoji ranges
	for _, r := range str {
		switch {
		case r >= 0x1F000 && r <= 0x1FFFF: // Emoji & Symbols Supplement
			return false
		case r >= 0x2700 && r <= 0x27BF: // Dingbats (some emojis)
			return false
		case r >= 0x1F900 && r <= 0x1F9FF: // Supplemental Symbols and Pictographs
			return false
		case r >= 0xFE00 && r <= 0xFE0F: // Variation Selectors (emoji modifiers)
			return false
		case r >= 0x1F300 && r <= 0x1F5FF: // Misc Symbols and Pictographs
			return false
		}
	}

	return true
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
				return errors.New(helpers.ValidationErrorOnField(key, err.(validator.ValidationErrors)[0].ActualTag()))
			}
		}

	}
	// Check for extra fields in body that aren't in rules
	for key := range body {
		if _, exists := rulesMap[key]; !exists {
			return errors.New(helpers.UnexpectedFieldError(key))
		}
	}

	return nil
}
