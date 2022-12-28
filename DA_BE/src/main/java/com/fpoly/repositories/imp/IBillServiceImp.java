/**
 * 
 */
package com.fpoly.repositories.imp;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.fpoly.entities.Bills;
import com.fpoly.repositories.irepo.IBillService;
import com.fpoly.repositories.repo.BillRepository;

/**
 *
 * @author trucnv
 *
 */
@Service
public class IBillServiceImp implements IBillService {

	@Autowired
	private BillRepository billRepo;

	@Override
	public Iterable<Bills> findAll() {
		return billRepo.findAll();
	}

	@Override
	public Optional<Bills> findById(Integer id) {
		return billRepo.findById(id);
	}

	@Override
	public Bills save(Bills t) {
		return billRepo.save(t);
	}

	@Override
	public void remove(Integer id) {
		billRepo.deleteById(id);
	}

	@Override
	public List<Bills> getAllBillByStatus (Integer status) {
		return billRepo.findByStatus(status);
	}

	@Override
	public Bills getBillByIdBooking(Integer idBooking) {
		return billRepo.getBillByIdBooking(idBooking);
	}
}
