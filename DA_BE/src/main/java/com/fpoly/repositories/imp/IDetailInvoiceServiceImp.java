/**
 * 
 */
package com.fpoly.repositories.imp;

import java.util.List;
import java.util.Optional;

import com.fpoly.entities.Bills;
import com.fpoly.entities.Rooms;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.fpoly.entities.DetailsInvoice;
import com.fpoly.repositories.irepo.IDetailInvoiceService;
import com.fpoly.repositories.repo.DetailInvoiceRepository;

/**
 *
 * @author trucnv
 *
 */
@Service
public class IDetailInvoiceServiceImp implements IDetailInvoiceService {

	@Autowired
	private DetailInvoiceRepository voiceRepo;

	@Override
	public Iterable<DetailsInvoice> findAll() {
		return voiceRepo.findAll();
	}

	@Override
	public Optional<DetailsInvoice> findById(Integer id) {
		return voiceRepo.findById(id);
	}

	@Override
	public DetailsInvoice save(DetailsInvoice t) {
		return voiceRepo.save(t);
	}

	@Override
	public void remove(Integer id) {
		voiceRepo.deleteById(id);
	}

	@Override
	public DetailsInvoice findByRoomsAndStatus(Rooms rooms, int status) {
		return voiceRepo.findByRoomsAndStatus(rooms, status);
	}

	@Override
	public List<DetailsInvoice> findByBillsAndStatus(Integer idBill) {
		return voiceRepo.findByBillsAndStatus(idBill);
	}

	@Override
	public List<DetailsInvoice> getListDetailInvoiceByDate(Integer roomId, String date) {
		return voiceRepo.getListDetailInvoiceByDate(roomId, date);
	}

	@Override
	public List<DetailsInvoice> getAllDetailInvoiceByRoomAndStatus(Integer roomId) {
		return voiceRepo.getAllDetailInvoiceByRoomAndStatus(roomId);
	}

	@Override
	public List<DetailsInvoice> getDetailInvoiceByIdBill(Integer idBill) {
		return voiceRepo.getDetailInvoiceByIdBill(idBill);
	}
}
