package com.laptop.laptopstore.controllers;

import com.laptop.laptopstore.models.User;
import com.laptop.laptopstore.security.JwtUtils;
import com.laptop.laptopstore.services.UserService;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class UserController {
    private final UserService userService;
    private final AuthenticationManager authenticationManager;
    private final JwtUtils jwtUtils;

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody User user) {
        try {
            User newUser = userService.register(user);
            return ResponseEntity.ok(newUser);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest loginRequest) {
        try {
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(loginRequest.getUsername(), loginRequest.getPassword()));

            SecurityContextHolder.getContext().setAuthentication(authentication);
            String jwt = jwtUtils.generateJwtToken(loginRequest.getUsername());

            return ResponseEntity.ok(new JwtResponse(jwt, loginRequest.getUsername()));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Sai tên đăng nhập hoặc mật khẩu!");
        }
    }
}

@Data
class LoginRequest {
    private String username;
    private String password;
}

@Data
class JwtResponse {
    private String token;
    private String username;

    public JwtResponse(String token, String username) {
        this.token = token;
        this.username = username;
    }
}
