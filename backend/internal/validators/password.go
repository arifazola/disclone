package validators

import "regexp"

func Password(password string) bool {
	if len(password) < 8 || len(password) > 32 {
		return false
	}

	// 2. Compile individual rules
	hasLower := regexp.MustCompile(`[a-z]`)
	hasUpper := regexp.MustCompile(`[A-Z]`)
	hasDigit := regexp.MustCompile(`[0-9]`)
	hasSpecial := regexp.MustCompile(`[!@#\$%\^&\*\(\)_\+\-=\[\]\{\};':",\./<>\?~` + "`" + `|]`)

	// 3. Match against all conditions
	if !hasLower.MatchString(password) {
		return false
	}
	if !hasUpper.MatchString(password) {
		return false
	}
	if !hasDigit.MatchString(password) {
		return false
	}
	if !hasSpecial.MatchString(password) {
		return false
	}

	return true
}
