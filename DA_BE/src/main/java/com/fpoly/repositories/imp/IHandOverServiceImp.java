/**
 * 
 */
package com.fpoly.repositories.imp;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.fpoly.entities.HandOver;
import com.fpoly.repositories.irepo.IHandOverService;
import com.fpoly.repositories.repo.HandOverRepository;

/**
 *
 * @author trucnv
 *
 */
@Service
public class IHandOverServiceImp implements IHandOverService {

	@Autowired
	private HandOverRepository handRepo;

	@Override
	public Iterable<HandOver> findAll() {
		return handRepo.findAll();
	}

	@Override
	public Optional<HandOver> findById(Integer id) {
		return handRepo.findById(id);
	}

	@Override
	public HandOver save(HandOver t) {
		return handRepo.save(t);
	}

	@Override
	public void remove(Integer id) {
		handRepo.deleteById(id);
	}

}
