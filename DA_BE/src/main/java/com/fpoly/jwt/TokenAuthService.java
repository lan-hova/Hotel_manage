/**
 * 
 */
package com.fpoly.jwt;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import com.fpoly.services.SecurityUserDetailsService;

/**
 *
 * @author trucnv
 *
 */

@Service
public class TokenAuthService {

	@Autowired
	private JwtTokenUtil jwtToken;
	@Autowired
	private SecurityUserDetailsService userDetails;

	public static final String AUTH_HEADER_NAME = "token";
	public static final String AUTH_USERNAME = "username";

	public void addJwtTokenToHeader(HttpServletResponse response, UserAuthentication authentication) {
		final UserDetails user = authentication.getDetails();
		response.addHeader(AUTH_HEADER_NAME, jwtToken.generateToken(user));
		response.addHeader(AUTH_USERNAME, user.getUsername());
	}

	public Authentication generateAuthenticationFromRequest(HttpServletRequest request) {
		final String token = request.getHeader(AUTH_HEADER_NAME);
		if (token == null || token.isEmpty())
			return null;
		return new UserAuthentication(userDetails.loadUserByUsername(this.jwtToken.getUsernameFromToken(token)));
	}

}
