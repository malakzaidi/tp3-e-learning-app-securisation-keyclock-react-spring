package org.elearning.tp3elearningappsecurisationkeyclockreactspring.config;

import org.springframework.core.convert.converter.Converter;
import org.springframework.security.authentication.AbstractAuthenticationToken;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.Collection;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Component
public class KeyclockJwtAuthenticationConverter implements Converter<Jwt, AbstractAuthenticationToken> {

    @Override
    public AbstractAuthenticationToken convert(Jwt jwt) {
        Collection<GrantedAuthority> authorities = extractAuthorities(jwt);

        // Log pour debug
        System.out.println("=== JWT Claims ===");
        System.out.println("All claims: " + jwt.getClaims());
        System.out.println("Extracted authorities: " + authorities);

        return new JwtAuthenticationToken(jwt, authorities);
    }

    private Collection<GrantedAuthority> extractAuthorities(Jwt jwt) {
        List<GrantedAuthority> authorities = new ArrayList<>();

        // Extraire les rôles depuis realm_access
        Map<String, Object> realmAccess = jwt.getClaim("realm_access");
        if (realmAccess != null && realmAccess.containsKey("roles")) {
            @SuppressWarnings("unchecked")
            List<String> roles = (List<String>) realmAccess.get("roles");

            authorities.addAll(
                    roles.stream()
                            .map(role -> {
                                // Si le rôle commence déjà par "ROLE_", ne pas l'ajouter à nouveau
                                if (role.startsWith("ROLE_")) {
                                    return new SimpleGrantedAuthority(role);
                                } else {
                                    return new SimpleGrantedAuthority("ROLE_" + role);
                                }
                            })
                            .collect(Collectors.toList())
            );
        }

        // Extraire les rôles depuis resource_access (si nécessaire)
        Map<String, Object> resourceAccess = jwt.getClaim("resource_access");
        if (resourceAccess != null) {
            resourceAccess.forEach((resource, roles) -> {
                if (roles instanceof Map) {
                    @SuppressWarnings("unchecked")
                    Map<String, Object> rolesMap = (Map<String, Object>) roles;
                    if (rolesMap.containsKey("roles")) {
                        @SuppressWarnings("unchecked")
                        List<String> resourceRoles = (List<String>) rolesMap.get("roles");
                        authorities.addAll(
                                resourceRoles.stream()
                                        .map(role -> {
                                            // Si le rôle commence déjà par "ROLE_", ne pas l'ajouter à nouveau
                                            if (role.startsWith("ROLE_")) {
                                                return new SimpleGrantedAuthority(role);
                                            } else {
                                                return new SimpleGrantedAuthority("ROLE_" + role);
                                            }
                                        })
                                        .collect(Collectors.toList())
                        );
                    }
                }
            });
        }

        return authorities;
    }
}