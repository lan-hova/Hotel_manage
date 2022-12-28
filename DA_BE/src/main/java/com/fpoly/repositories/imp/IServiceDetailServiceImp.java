/**
 * 
 */
package com.fpoly.repositories.imp;

import java.util.List;
import java.util.Optional;

import com.fpoly.entities.DetailsInvoice;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.fpoly.entities.ServiceDetails;
import com.fpoly.repositories.irepo.IServiceDetailService;
import com.fpoly.repositories.repo.ServiceDetailRepository;

/**
 *
 * @author trucnv
 *
 */
@Service
public class IServiceDetailServiceImp implements IServiceDetailService {

	@Autowired
	private ServiceDetailRepository svdetailRepo;

	@Override
	public Iterable<ServiceDetails> findAll() {
		return svdetailRepo.findAll();
	}

	@Override
	public Optional<ServiceDetails> findById(Integer id) {
		return svdetailRepo.findById(id);
	}

	@Override
	public ServiceDetails save(ServiceDetails t) {
		return svdetailRepo.save(t);
	}

	@Override
	public void remove(Integer id) {
		svdetailRepo.deleteById(id);
	}

	@Override
	public List<ServiceDetails> listByRoomAndStatus(DetailsInvoice detailsInvoice, Integer status) {
		return svdetailRepo.listByRoomAndStatus(detailsInvoice, status);
	}

}
