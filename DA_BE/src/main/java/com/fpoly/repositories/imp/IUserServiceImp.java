/**
 * 
 */
package com.fpoly.repositories.imp;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.fpoly.entities.Users;
import com.fpoly.repositories.irepo.IUserService;
import com.fpoly.repositories.repo.UserRepository;

/**
 *
 * @author trucnv
 *
 */
@Service
public class IUserServiceImp implements IUserService {

	@Autowired
	private UserRepository userRepo;

	@Override
	public Iterable<Users> findAll() {
		return userRepo.findAll();
	}

	@Override
	public Optional<Users> findById(Integer id) {
		return userRepo.findById(id);
	}

	@Override
	public Users save(Users t) {
		return userRepo.save(t);
	}

	@Override
	public void remove(Integer id) {
		userRepo.deleteById(id);
	}

}
