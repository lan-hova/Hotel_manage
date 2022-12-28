/**
 * 
 */
package com.fpoly.repositories.imp;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.fpoly.entities.Nationality;
import com.fpoly.repositories.irepo.INationalityService;
import com.fpoly.repositories.repo.NationalityRepository;

/**
 *
 * @author trucnv
 *
 */
@Service
public class INationalityServiceImp implements INationalityService {

	@Autowired
	private NationalityRepository natiRepo;

	@Override
	public Iterable<Nationality> findAll() {
		return natiRepo.findAll();
	}

	@Override
	public Optional<Nationality> findById(Integer id) {
		return natiRepo.findById(id);
	}

	@Override
	public Nationality save(Nationality t) {
		return natiRepo.save(t);
	}

	@Override
	public void remove(Integer id) {
		natiRepo.deleteById(id);
	}

}
