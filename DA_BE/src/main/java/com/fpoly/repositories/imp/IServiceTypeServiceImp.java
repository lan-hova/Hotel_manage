/**
 * 
 */
package com.fpoly.repositories.imp;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.fpoly.entities.ServiceType;
import com.fpoly.repositories.irepo.IServiceTypeService;
import com.fpoly.repositories.repo.ServiceTypeRepository;

/**
 *
 * @author trucnv
 *
 */
@Service
public class IServiceTypeServiceImp implements IServiceTypeService {

	@Autowired
	private ServiceTypeRepository serviceTypeRepo;

	@Override
	public Iterable<ServiceType> findAll() {
		return serviceTypeRepo.findAll();
	}

	@Override
	public Optional<ServiceType> findById(Integer id) {
		return serviceTypeRepo.findById(id);
	}

	@Override
	public ServiceType save(ServiceType t) {
		return serviceTypeRepo.save(t);
	}

	@Override
	public void remove(Integer id) {
		serviceTypeRepo.deleteById(id);
	}

}
