/**
 * 
 */
package com.fpoly.repositories.imp;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.fpoly.entities.Personnel;
import com.fpoly.repositories.irepo.IPersonnelService;
import com.fpoly.repositories.repo.PersonnelRepository;

/**
 *
 * @author trucnv
 *
 */
@Service
public class IPersonnelServiceImp implements IPersonnelService {

	@Autowired
	private PersonnelRepository personnelRepo;

	@Override
	public Iterable<Personnel> findAll() {
		return personnelRepo.findAll();
	}

	@Override
	public Optional<Personnel> findById(Integer id) {
		return personnelRepo.findById(id);
	}

	@Override
	public Personnel save(Personnel t) {
		return personnelRepo.save(t);
	}

	@Override
	public void remove(Integer id) {
		personnelRepo.deleteById(id);
	}

	@Override
	public Personnel getPersonnelByUserName(String userName) {
		return personnelRepo.getPersonnelByUserName(userName);
	}
}
