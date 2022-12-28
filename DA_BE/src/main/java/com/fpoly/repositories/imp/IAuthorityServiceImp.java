/**
 * 
 */
package com.fpoly.repositories.imp;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.fpoly.entities.Authority;
import com.fpoly.repositories.irepo.IAuthorityService;
import com.fpoly.repositories.repo.AuthorityRepository;

/**
 *
 * @author trucnv
 *
 */
@Service
public class IAuthorityServiceImp implements IAuthorityService {

	@Autowired
	private AuthorityRepository authRepo;

	@Override
	public Iterable<Authority> findAll() {
		return authRepo.findAll();
	}

	@Override
	public Optional<Authority> findById(Integer id) {
		return authRepo.findById(id);
	}

	@Override
	public Authority save(Authority t) {
		return authRepo.save(t);
	}

	@Override
	public void remove(Integer id) {
		authRepo.deleteById(id);
	}

}
