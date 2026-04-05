package com.securelens.backend.config;

import com.securelens.backend.security.CustomUserDetailsService;
import com.securelens.backend.security.JwtUtil;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.List;

@Component
@RequiredArgsConstructor
public class JwtFilter extends OncePerRequestFilter {

    private final JwtUtil jwtUtil;
    private final CustomUserDetailsService userDetailsService;

    // ── Public paths that skip JWT check completely ────────
    private static final List<String> PUBLIC_PATHS = List.of(
        "/api/health",
        "/api/auth/login",
        "/api/auth/register"
    );

    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain) throws ServletException, IOException {

        String requestPath = request.getServletPath();

        // ── Skip JWT check for public paths ───────────────
        boolean isPublic = PUBLIC_PATHS.stream()
                .anyMatch(requestPath::startsWith);

        if (isPublic) {
            filterChain.doFilter(request, response);
            return;
        }

        // ── Get Authorization header ───────────────────────
        final String authHeader = request.getHeader("Authorization");

        // ── Skip if no token ───────────────────────────────
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            filterChain.doFilter(request, response);
            return;
        }

        // ── Extract and validate token ─────────────────────
        try {
            final String token = authHeader.substring(7);
            final String email = jwtUtil.extractUsername(token);

            if (email != null &&
                SecurityContextHolder.getContext()
                    .getAuthentication() == null) {

                var userDetails =
                    userDetailsService.loadUserByUsername(email);

                if (jwtUtil.isTokenValid(token, userDetails)) {
                    var authToken =
                        new UsernamePasswordAuthenticationToken(
                            userDetails,
                            null,
                            userDetails.getAuthorities()
                        );
                    authToken.setDetails(
                        new WebAuthenticationDetailsSource()
                            .buildDetails(request)
                    );
                    SecurityContextHolder.getContext()
                        .setAuthentication(authToken);
                }
            }
        } catch (Exception e) {
            // Invalid token - just continue without auth
            SecurityContextHolder.clearContext();
        }

        filterChain.doFilter(request, response);
    }
}