/**
 * 
 */
package com.fpoly.repositories.imp;

import java.util.List;
import java.util.Optional;

import com.fpoly.entities.Rooms;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.fpoly.entities.FacilitiesDetails;
import com.fpoly.repositories.irepo.IFacilityDetailService;
import com.fpoly.repositories.repo.FacilityDetailRepository;

/**
 *
 * @author trucnv
 *
 */
@Service
public class IFacilityDetailServiceImp implements IFacilityDetailService {

	@Autowired
	private FacilityDetailRepository facilitydetailRepo;

	@Override
	public Iterable<FacilitiesDetails> findAll() {
		return facilitydetailRepo.findAll();
	}

	@Override
	public Optional<FacilitiesDetails> findById(Integer id) {
		return facilitydetailRepo.findById(id);
	}

	@Override
	public FacilitiesDetails save(FacilitiesDetails t) {
		return facilitydetailRepo.save(t);
	}

	@Override
	public void remove(Integer id) {
		facilitydetailRepo.deleteById(id);
	}

	@Override
	public List<FacilitiesDetails> findByRoomsAndStatus(Rooms rooms, int status) {
		return facilitydetailRepo.findByRoomsAndStatus(rooms, status);
	}
}
