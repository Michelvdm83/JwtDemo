package com.example.jwt.security;

import java.util.Date;

public record TokenData(String username, String[] roles, Date issueDate, Date expirationDate) {
    public boolean isExpired() {
        return expirationDate.before(new Date());
    }
}

