package middleware

import (
	"errors"
	"fmt"
	"log"
	"net/http"
	"strings"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt"
)

type JwtClaims struct {
	TokenEmail string `json:"email"`
	jwt.StandardClaims
}

var SECRET_KEY = "csc419"

func GenerateToken(email string) (string, error) {
	claims := &JwtClaims{
		TokenEmail: email,
		StandardClaims: jwt.StandardClaims{
			ExpiresAt: time.Now().Add(time.Hour * 24 * 30).Unix(), // Approximate one month
			IssuedAt:  time.Now().Unix(),
		},
	}
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	t, err := token.SignedString([]byte(SECRET_KEY))
	if err != nil {
		log.Panic(err)
		return "", err
	}
	return t, nil

}

func ExtractEmailUserCreds(ctx *gin.Context) (string, string, error) {
	authHeader := ctx.GetHeader("Authorization")
	if authHeader == "" {
		log.Println("Authorization header required")
		ctx.JSON(http.StatusUnauthorized, gin.H{"error": " Unauthorized"})
		return "", "", fmt.Errorf("authorization header required")
	}
	claims, err := getClaims(authHeader)
	if err != nil {
		log.Println("invalid or expired token", err)
		ctx.JSON(http.StatusUnauthorized, gin.H{"error": "invalid or expired token"})
		return "", "", err
	}
	emailClaims := claims.TokenEmail

	return emailClaims, authHeader, nil
}

func getClaims(tokenString string) (*JwtClaims, error) {
	token, err := jwt.ParseWithClaims(tokenString, &JwtClaims{}, func(token *jwt.Token) (interface{}, error) {
		if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
			return nil, fmt.Errorf("unexpected signing method: %v", token.Header["alg"])
		}
		return []byte(SECRET_KEY), nil
	})
	if err != nil {
		return nil, err
	}
	if claims, ok := token.Claims.(*JwtClaims); ok && token.Valid {
		if claims.ExpiresAt < time.Now().Unix() {
			return nil, errors.New("token has expired")
		}
		return claims, nil
	}
	return nil, errors.New("invalid token")
}

func Auth() gin.HandlerFunc {
	return func(c *gin.Context) {
		// Retrieve the Authorization header
		authHeader := c.GetHeader("Authorization")
		if authHeader == "" {
			log.Println("Authorization header required")
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized, Authorization required"})
			c.Abort()
			return
		}

		tokenString := strings.TrimSpace(strings.Replace(authHeader, "Bearer", "", 1))
		claims, err := getClaims(tokenString)
		if err != nil {
			log.Println("invalid or expired token:", err)
			c.JSON(http.StatusUnauthorized, gin.H{"error": "invalid or expired token"})
			c.Abort()
			return
		}

		// Set the user ID in the request context
		c.Set("claims", claims)
		c.Next()
	}
}
