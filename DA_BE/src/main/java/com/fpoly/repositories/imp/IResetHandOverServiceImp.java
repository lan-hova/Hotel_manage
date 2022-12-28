/**
 * 
 */
package com.fpoly.repositories.imp;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.fpoly.entities.ResetHandOver;
import com.fpoly.repositories.irepo.IResetHandOverService;
import com.fpoly.repositories.repo.ResetHandOverRepository;

/**
 *
 * @author trucnv
 *
 */
@Service
public class IResetHandOverServiceImp implements IResetHandOverService {

	@Autowired
	private ResetHandOverRepository resetHandRepo;

	@Override
	public Iterable<ResetHandOver> findAll() {
		return resetHandRepo.findAll();
	}

	@Override
	public Optional<ResetHandOver> findById(Integer id) {
		return resetHandRepo.findById(id);
	}

	@Override
	public ResetHandOver save(ResetHandOver t) {
		return resetHandRepo.save(t);
	}

	@Override
	public void remove(Integer id) {
		resetHandRepo.deleteById(id);
	}

}
