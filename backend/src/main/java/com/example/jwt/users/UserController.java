package com.example.jwt.users;

import com.example.jwt.security.AuthDTO;
import com.example.jwt.security.JwtService;
import com.example.jwt.security.TokenDTO;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ProblemDetail;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.util.UriComponentsBuilder;

import java.util.regex.Pattern;

@RestController
@RequestMapping("auth")
@RequiredArgsConstructor
@CrossOrigin(origins = "${jwt-demo.cors}")
public class UserController {
    private final JwtService jwtService;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @PostMapping("login")
    public ResponseEntity<?> login(@RequestBody AuthDTO authDTO) {
        if (authDTO.username() == null || authDTO.password() == null) {
            return ResponseEntity
                    .badRequest()
                    .body(ProblemDetail.forStatusAndDetail(
                            HttpStatus.BAD_REQUEST,
                            "username and password are required"
                    ));
        }

        if (userRepository.findByUsername(authDTO.username()).isEmpty()
                || !passwordEncoder.matches(authDTO.password(), userRepository.findByUsername(authDTO.username()).orElseThrow(RuntimeException::new).getPassword())) {
            return ResponseEntity
                    .badRequest()
                    .body(ProblemDetail.forStatusAndDetail(
                            HttpStatus.BAD_REQUEST,
                            "username or password incorrect"
                    ));
        }

        return ResponseEntity.ok(
                new TokenDTO(
                        jwtService.generateTokenForUser(authDTO.username()),
                        authDTO.username()
                )
        );
    }

    @PostMapping("register")
    public ResponseEntity<?> register(@RequestBody AuthDTO authDTO, UriComponentsBuilder ucb) {
        if (authDTO == null || authDTO.username() == null || authDTO.password() == null) {
            return ResponseEntity
                    .badRequest()
                    .body(ProblemDetail.forStatusAndDetail(
                            HttpStatus.BAD_REQUEST,
                            "username and password are required"
                    ));
        }

        if (userRepository.findByUsername(authDTO.username()).isPresent()
                || !isValidPassword(authDTO.password())) {
            return ResponseEntity
                    .badRequest()
                    .body(ProblemDetail.forStatusAndDetail(
                            HttpStatus.BAD_REQUEST,
                            "username or password is invalid"
                    ));
        }

        User user = userRepository.save(new User(
                authDTO.username(),
                passwordEncoder.encode(authDTO.password()), "ROLE_user")
        );

        return ResponseEntity.ok().build();
    }

//    private static final String PASSWORD_SPECIAL_CHARACTER_PATTERN = "[!@#$%&*()_+=|<>?{}\\[\\]~-]";
    public boolean isValidPassword(String password) {
        return password != null
                && password.length() >= 5
                && Pattern.compile("[0-9]").matcher(password).find()
                && Pattern.compile("[a-z]").matcher(password).find()
                && Pattern.compile("[A-Z]").matcher(password).find();
               /* && Pattern.compile(PASSWORD_SPECIAL_CHARACTER_PATTERN).matcher(password).find();*/
    }
}