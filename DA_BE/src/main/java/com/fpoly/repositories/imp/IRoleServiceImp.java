/**
 * 
 */
package com.fpoly.repositories.imp;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.fpoly.entities.Roles;
import com.fpoly.repositories.irepo.IRoleService;
import com.fpoly.repositories.repo.RoleRepository;

/**
 *
 * @author trucnv
 *
 */
@Service
public class IRoleServiceImp implements IRoleService {

	@Autowired
	private RoleRepository roleRepo;

	@Override
	public Iterable<Roles> findAll() {
		return roleRepo.findAll();
	}

	@Override
	public Optional<Roles> findById(Integer id) {
		return roleRepo.findById(id);
	}

	@Override
	public Roles save(Roles t) {
		return roleRepo.save(t);
	}

	@Override
	public void remove(Integer id) {
		roleRepo.deleteById(id);
	}

}
