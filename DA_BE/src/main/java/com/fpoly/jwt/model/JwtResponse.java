package com.fpoly.jwt.model;

import java.io.Serializable;

import lombok.AllArgsConstructor;
import lombok.Data;

/**
 *
 * @author trucnv
 *
 */

@Data
@AllArgsConstructor
public class JwtResponse implements Serializable {

	private static final long serialVersionUID = -8091879091924046844L;

	private final String accessToken;

	private final String username;

}
