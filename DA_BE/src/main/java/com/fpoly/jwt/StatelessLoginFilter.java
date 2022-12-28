/**
 * 
 */
package com.fpoly.jwt;

import java.io.IOException;

import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.AbstractAuthenticationProcessingFilter;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fpoly.jwt.model.JwtRequest;
import com.fpoly.services.SecurityUserDetailsService;


/**
 *
 * @author trucnv 
 *
 */

public class StatelessLoginFilter extends AbstractAuthenticationProcessingFilter{

	private final TokenAuthService tokenAuthenticationService;

	private final SecurityUserDetailsService userService;

	public StatelessLoginFilter(String urlMapping, TokenAuthService tokenAuthenticationService,
			SecurityUserDetailsService userService, AuthenticationManager authenticationManager) {
		super(urlMapping);
		this.tokenAuthenticationService = tokenAuthenticationService;
		this.userService = userService;
		setAuthenticationManager(authenticationManager);
	}

	@Override
	public Authentication attemptAuthentication(HttpServletRequest request, HttpServletResponse response)
			throws IOException, ServletException {
		if (!request.getMethod().equals("POST")) {
			return null;
		}
		final JwtRequest user = this.toUser(request);
		final UsernamePasswordAuthenticationToken loginToken = user.toAuthenticationToken();
		return getAuthenticationManager().authenticate(loginToken);
	}

	private JwtRequest toUser(HttpServletRequest request) throws IOException {
		return new ObjectMapper().readValue(request.getInputStream(), JwtRequest.class);
	}

	@Override
	protected void successfulAuthentication(HttpServletRequest request, HttpServletResponse response, FilterChain chain,
			Authentication authResult) throws IOException, ServletException {
		final UserDetails authenticatedUser = this.userService.loadUserByUsername(authResult.getName());
		final UserAuthentication userAuthentication = new UserAuthentication(authenticatedUser);
		this.tokenAuthenticationService.addJwtTokenToHeader(response, userAuthentication);
		SecurityContextHolder.getContext().setAuthentication(userAuthentication);
	}

}
