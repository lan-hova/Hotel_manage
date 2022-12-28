/**
 * 
 */
package com.fpoly.repositories.imp;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.fpoly.entities.Facilities;
import com.fpoly.repositories.irepo.IFacilityService;
import com.fpoly.repositories.repo.FacilityRepository;

/**
 *
 * @author trucnv
 *
 */
@Service
public class IFacilityServiceImp implements IFacilityService {

	@Autowired
	private FacilityRepository facilityRepo;

	@Override
	public Iterable<Facilities> findAll() {
		return facilityRepo.findAll();
	}

	@Override
	public Optional<Facilities> findById(Integer id) {
		return facilityRepo.findById(id);
	}

	@Override
	public Facilities save(Facilities t) {
		return facilityRepo.save(t);
	}

	@Override
	public void remove(Integer id) {
		facilityRepo.deleteById(id);
	}

}
